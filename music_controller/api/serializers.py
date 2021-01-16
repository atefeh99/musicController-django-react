from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id','code','host','guest_can_pause','votes_to_skip','created_at')

class CreateRoomSerializer(serializers.ModelSerializer):
    class  Meta:
        model = Room
        fields = ('guest_can_pause','votes_to_skip')
class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])
    #this code is different from our model code because if they want to be same, our model code has a unique attribute and it will cause 
    # problems every time we change the room
    class Meta:
        model = Room
        fields = ('guest_can_pause','votes_to_skip','code')
        