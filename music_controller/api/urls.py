from django.urls import path
from .views import RoomView,CreateRoom,GetRoom, JoinRoom, UserInRoom,LeaveRoom,UpdateRoom

urlpatterns = [
    path('room/',RoomView.as_view(),name='room_view'),
    path('create_room/',CreateRoom.as_view(),name='room_view'),
    path('get_room/',GetRoom.as_view()),
    path('join-room/',JoinRoom.as_view()),
    path('user_in_room',UserInRoom.as_view()),
    path('leave_room/',LeaveRoom.as_view()),
    path('update_room',UpdateRoom.as_view())
    


]
