from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone, dateformat


class Post(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    message = models.CharField(max_length=500, blank=True)
    created_at = models.TextField(default=dateformat.format(timezone.now(), 'Y-m-d H:i:s'), null=True)
    likes = models.ManyToManyField(User)


class Group(models.Model):
    name = models.CharField(max_length=100)
    avatar = models.TextField(null=True)
    about = models.TextField(null=True)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    subscribers = models.ManyToManyField(User, related_name="subscribers")
    posts = models.ManyToManyField(Post)


class Message(models.Model):
    created_at = models.TextField(default=dateformat.format(timezone.now(), 'Y-m-d H:i:s'), null=True)
    body = models.TextField(null=True)
    authorId = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)


class Chat(models.Model):
    partner = models.ManyToManyField(User, related_name="partners")
    messages = models.ManyToManyField(Message)


class MyUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True)
    avatar = models.TextField(null=True)
    about_me = models.TextField(null=True)
    friends = models.ManyToManyField(User, related_name="friends")
    posts = models.ManyToManyField(Post, related_name="posts")
    groups = models.ManyToManyField(Group, related_name="groups")
    chats = models.ManyToManyField(Chat, related_name="chats")
