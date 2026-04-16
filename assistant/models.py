from django.db import models
import uuid

class Task(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed')
    ]

    # Core Task Info
    task_code = models.CharField(max_length=15, unique=True, blank=True)
    intent = models.CharField(max_length=50)
    
    # We use JSONField to easily store the structured data from the AI
    entities = models.JSONField(default=dict)
    generated_steps = models.JSONField(default=list, blank=True)
    
    # Operations Data
    risk_score = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    employee_assignment = models.CharField(max_length=50, blank=True)
    
    # The Three Required Message Formats
    whatsapp_message = models.TextField(blank=True)
    email_message = models.TextField(blank=True)
    sms_message = models.CharField(max_length=160, blank=True)
    
    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Automatically generate a unique short code when a task is first created
        if not self.task_code:
            self.task_code = f"VN-{str(uuid.uuid4())[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.task_code} - {self.intent}"