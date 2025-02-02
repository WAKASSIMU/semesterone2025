from django.db import models

# Create your models here.
class SecurityOffice(models.Model):
    statuschoice={
        "PRIVATE":"PRIVATE",
        "PUBLIC":"PUBLIC",
    }
    officename = models.CharField(max_length=30)
    location= models.CharField(max_length=20)
    status= models.CharField(max_length=20,choices=statuschoice)

    def __str__ (self):
        return f"{self.officename}"
    
class ArmedSecurityGuard(models.Model):
    statuschoice={
        "ORDINARY":"ordinary",
        "ADVANCED":"advanced",
    }
    genderchoice={
        "M":"MALE",
        "F":"FIMALE",
    }
    name=models.CharField(max_length=30)
    age=models.IntegerField()
    phone=models.IntegerField()
    adress=models.CharField(max_length=50)
    status=models.CharField(max_length=10, choices=statuschoice)
    gender=models.CharField(max_length=1, choices=genderchoice)
    worked_office=models.ForeignKey(SecurityOffice, on_delete=models.CASCADE)

    def __str__ (self):
        return f"{self.name}"
class Organization(models.Model):
    statuschoice={
        "PRIVATE":"PRIVATE",
        "PUBLIC":"PUBLIC",
    }
    name = models.CharField(max_length=30)
    location= models.CharField(max_length=20)
    bussiness=models.CharField(max_length=20)
    password = models.CharField(max_length=128, null=True, blank=True)
    status= models.CharField(max_length=7, choices=statuschoice)

    def __str__ (self):
        return f"{self.name}"
class Order(models.Model):
    STATUS_CHOICES = [
        ("ORDINARY", "ORDINARY"),
        ("ADVANCED", "ADVANCED"),
    ]

    Office_name = models.ForeignKey(SecurityOffice, on_delete=models.CASCADE)
    Organization_name = models.ForeignKey(Organization, on_delete=models.CASCADE)
    guardAge = models.IntegerField(null=True, blank=True)
    guardSex = models.CharField(max_length=5, null=True, blank=True)
    guardStatus = models.CharField(max_length=10, choices=STATUS_CHOICES, null=True, blank=True)

    def __str__(self):
        return f"{self.Office_name}"



