import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Task
from .ai_engine.llm_client import process_user_request

def index_view(request):
    return render(request, 'index.html')

def dashboard_view(request):
    return render(request, 'dashboard.html')

@csrf_exempt
def api_process_request(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_text = data.get('text', '')

            if not user_text:
                return JsonResponse({'error': 'No text provided'}, status=400)

            ai_data = process_user_request(user_text)

            if not ai_data:
                return JsonResponse({'error': 'AI processing failed'}, status=500)

            new_task = Task(
                intent=ai_data.get('intent'),
                entities=ai_data.get('entities', {}),
                risk_score=ai_data.get('risk_score'),
                generated_steps=ai_data.get('generated_steps', []),
                employee_assignment=ai_data.get('employee_assignment', '')
            )
            new_task.save() 

            task_code = new_task.task_code
            new_task.whatsapp_message = ai_data.get('whatsapp_message', '').replace('[TASK_CODE]', task_code)
            new_task.email_message = ai_data.get('email_message', '').replace('[TASK_CODE]', task_code)
            new_task.sms_message = ai_data.get('sms_message', '').replace('[TASK_CODE]', task_code)
            new_task.save()

            return JsonResponse({'message': 'Task created successfully', 'task_code': task_code}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method'}, status=405)

def api_get_tasks(request):
    tasks = list(Task.objects.all().order_by('-created_at').values())
    return JsonResponse(tasks, safe=False)

@csrf_exempt
def api_update_status(request, task_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_status = data.get('status')
            task = Task.objects.get(id=task_id)
            task.status = new_status
            task.save()
            return JsonResponse({'message': 'Status updated'})
        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task not found'}, status=404)
    return JsonResponse({'error': 'Invalid method'}, status=405)