from rest_framework import serializers
from .models import *

class OrderSerializer(serializers.ModelSerializer):
    Office_name = serializers.PrimaryKeyRelatedField(queryset=SecurityOffice.objects.all())
    Organization_name = serializers.PrimaryKeyRelatedField(queryset=Organization.objects.all())

    class Meta:
        model = Order
        fields = '__all__'


class OrganizationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organization
        fields = '__all__'

class SecurityOfficeSerializer(serializers.ModelSerializer):

    class Meta:
        model = SecurityOffice
        fields = '__all__'

class ArmedSecurityGuardSerializer(serializers.ModelSerializer):

    class Meta:
        model = ArmedSecurityGuard
        fields = '__all__'