# Generated by Django 5.1.3 on 2025-01-19 14:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_organization_password'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='guardAge',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='guardSex',
            field=models.CharField(blank=True, max_length=5, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='guardStatus',
            field=models.CharField(blank=True, max_length=7, null=True),
        ),
    ]
