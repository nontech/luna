from django.db import migrations
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

def create_groups_and_permissions(apps, schema_editor):
    # Get the models from apps to ensure we're using the historical version
    Classrooms = apps.get_model('lab', 'Classrooms')
    Exercises = apps.get_model('lab', 'Exercises')
    Group = apps.get_model('auth', 'Group')
    Permission = apps.get_model('auth', 'Permission')
    ContentType = apps.get_model('contenttypes', 'ContentType')

    # Create groups
    teachers_group, _ = Group.objects.get_or_create(name='Teachers')
    students_group, _ = Group.objects.get_or_create(name='Students')

    # Get content types
    classroom_ct = ContentType.objects.get_for_model(Classrooms)
    exercise_ct = ContentType.objects.get_for_model(Exercises)

    # Define permissions mapping
    permissions_data = {
        'Teachers': [
            ('view_classrooms', classroom_ct),
            ('add_classrooms', classroom_ct),
            ('change_classrooms', classroom_ct),
            ('delete_classrooms', classroom_ct),
            ('view_exercises', exercise_ct),
            ('add_exercises', exercise_ct),
            ('change_exercises', exercise_ct),
            ('delete_exercises', exercise_ct),
        ],
        'Students': [
            ('view_classrooms', classroom_ct),
            ('view_exercises', exercise_ct),
        ]
    }

    # Create and assign permissions
    for group_name, permissions in permissions_data.items():
        group = Group.objects.get(name=group_name)
        group_permissions = []
        
        for codename, content_type in permissions:
            # Try to get existing permission first
            try:
                permission = Permission.objects.get(
                    codename=codename,
                    content_type=content_type,
                )
            except Permission.DoesNotExist:
                # Create permission only if it doesn't exist
                permission = Permission.objects.create(
                    codename=codename,
                    name=f'Can {codename.replace("_", " ")}',
                    content_type=content_type,
                )
            group_permissions.append(permission)
        
        # Set permissions for group
        group.permissions.set(group_permissions)

def reverse_func(apps, schema_editor):
    # Delete groups
    Group = apps.get_model('auth', 'Group')
    Group.objects.filter(name__in=['Teachers', 'Students']).delete()

class Migration(migrations.Migration):
    dependencies = [
        ('lab', '0001_initial'),
        ('auth', '0001_initial'),
        ('contenttypes', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_groups_and_permissions, reverse_func),
    ] 