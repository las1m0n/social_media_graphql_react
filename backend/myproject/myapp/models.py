from django.db import models
from django.contrib.auth.models import User


class Post(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    message = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)


class Group(models.Model):
    name = models.CharField(max_length=100)
    avatar = models.TextField(null=True)
    about = models.TextField(null=True)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    subscribers = models.ManyToManyField(User, related_name="subscribers")
    posts = models.ManyToManyField(Post)


class Message(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    body = models.TextField(null=True)
    authorId = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)


class Chat(models.Model):
    partner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    messages = models.ManyToManyField(Message)


class MyUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True)
    avatar = models.TextField(null=True)
    about_me = models.TextField(null=True)
    friends = models.ManyToManyField(User, related_name="friends")
    posts = models.ManyToManyField(Post, related_name="posts")
    groups = models.ManyToManyField(Group, related_name="groups")
    chats = models.ManyToManyField(Chat, related_name="chats")
