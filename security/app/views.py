from django.shortcuts import render

# Create your views here.
from .models import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import *
from rest_framework.permissions import IsAuthenticated

def generic_api(model_class, class_serializer):
    @api_view(['GET', 'POST', 'PUT', 'DELETE'])
    def api(request, pk=None):
        if request.method == 'GET':
            if pk:
                try:
                    instance = model_class.objects.get(pk=pk)
                    serializer = class_serializer(instance)
                    return Response(serializer.data)
                except model_class.DoesNotExist:
                    return Response({'Message': 'Object not found'}, status=404)
            else:
                instances = model_class.objects.all()
                serializer = class_serializer(instances, many=True)
                return Response(serializer.data)

        elif request.method == 'POST':
            serializer = class_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)

        elif request.method == 'PUT':
            if pk:
                try:
                    instance = model_class.objects.get(pk=pk)
                    serializer = class_serializer(instance, data=request.data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        return Response(serializer.data)
                    return Response(serializer.errors, status=400)
                except model_class.DoesNotExist:
                    return Response({'Message': 'Object not found'}, status=404)

        elif request.method == 'DELETE':
            if pk:
                try:
                    instance = model_class.objects.get(pk=pk)
                    instance.delete()
                    return Response({'Message': 'Object deleted successfully'}, status=204)
                except model_class.DoesNotExist:
                    return Response({'Message': 'Object not found'}, status=404)

        return Response({'Message': 'Invalid request'}, status=400)

    return api  # Ensure the `api` function is returned outside the conditional blocks


manage_order = generic_api(Order, OrderSerializer)
manage_SecurityOffice = generic_api(SecurityOffice, SecurityOfficeSerializer)
manage_ArmedSecurityGuard = generic_api(ArmedSecurityGuard, ArmedSecurityGuardSerializer)
manage_Organization = generic_api(Organization, OrganizationSerializer)
