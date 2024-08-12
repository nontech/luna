# Generated by Django 5.0.6 on 2024-08-11 20:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lab', '0003_alter_users_table'),
    ]

    operations = [
        migrations.CreateModel(
            name='Classrooms',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('description', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lab.users')),
            ],
            options={
                'db_table': 'classrooms',
            },
        ),
        migrations.CreateModel(
            name='ClassroomUsers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('classroom', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lab.classrooms')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lab.users')),
            ],
            options={
                'db_table': 'classroom_users',
            },
        ),
    ]