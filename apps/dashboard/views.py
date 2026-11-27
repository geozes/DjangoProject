
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.tasks.models import Task
from apps.tasks.serializers import TaskSerializer


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Only retrieve tasks belonging to the logged-in user
        tasks = Task.objects.filter(user=request.user)

        today = timezone.localdate()
        now = timezone.now()

        # Task counts
        total_tasks = tasks.count()

        pending_tasks = tasks.filter(
            status=Task.Status.PENDING
        ).count()

        in_progress_tasks = tasks.filter(
            status=Task.Status.IN_PROGRESS
        ).count()

        completed_tasks = tasks.filter(
            status=Task.Status.COMPLETED
        ).count()

        # Deadline counts (exclude completed tasks)
        overdue_tasks = tasks.filter(
            due_date__lt=now
        ).exclude(
            status=Task.Status.COMPLETED
        ).count()

        due_today_tasks = tasks.filter(
            due_date__date=today
        ).exclude(
            status=Task.Status.COMPLETED
        ).count()

        # Priority counts
        priority_summary = {
            'low': tasks.filter(
                priority=Task.Priority.LOW
            ).count(),

            'medium': tasks.filter(
                priority=Task.Priority.MEDIUM
            ).count(),

            'high': tasks.filter(
                priority=Task.Priority.HIGH
            ).count(),
        }

        # Five most recently created tasks
        recent_tasks = tasks.order_by('-created_at')[:5]

        recent_tasks_data = TaskSerializer(
            recent_tasks,
            many=True,
            context={'request': request}
        ).data

        # Dashboard response
        data = {
            'summary': {
                'total_tasks': total_tasks,
                'pending_tasks': pending_tasks,
                'in_progress_tasks': in_progress_tasks,
                'completed_tasks': completed_tasks,
                'overdue_tasks': overdue_tasks,
                'due_today_tasks': due_today_tasks,
            },
            'priority_summary': priority_summary,
            'recent_tasks': recent_tasks_data,
        }

        return Response(data)
