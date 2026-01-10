from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Category, Cake, Branch, Order
from .serializers import CakeSerializer, OrderSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
@api_view(['GET'])
def cake_list_api(request):
    cakes = Cake.objects.all()
    serializer = CakeSerializer(cakes, many=True)
    return Response(serializer.data)
@api_view(['GET'])
def cake_detail_api(request, id):
    try:
        cake = Cake.objects.get(id=id)
        return Response({
            "id": cake.id,
            "name": cake.name,
            "price": cake.price,
            "description": cake.description,
            "image": request.build_absolute_uri(cake.image.url) if cake.image else ""
        })
    except Cake.DoesNotExist:
        return Response({"error": "Cake not found"}, status=404)
@api_view(['GET'])
def category_list(request):
    categories = Category.objects.prefetch_related('cakes')
    data = []
    for cat in categories:
        data.append({
            "id": cat.id,
            "name": cat.name,
            "cakes": [
                {
                    "id": cake.id,
                    "name": cake.name,
                    "price": cake.price,
                    "image": request.build_absolute_uri(cake.image.url) if cake.image else "",
                }
                for cake in cat.cakes.all()
            ]
        })

    return Response(data)
@api_view(['GET'])
def branch_list(request):
    branches = Branch.objects.all()
    data = []
    for b in branches:
        data.append({
            "id": b.id,
            "name": b.name,
            "location": b.location,
            "phone": b.phone,
            "map_url": b.map_url,
            "open_time": b.open_time,
            "close_time": b.close_time,
            "is_main": b.is_main,
        })
    return Response(data)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def orders_api(request):
    if request.method == 'GET':
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    if request.method == 'POST':
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {"message": "Order placed successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def cancel_order(request, pk):
    try:
        order = Order.objects.get(id=pk, user=request.user)
        order.status = "cancelled"
        order.save()
        return Response({"message": "Order cancelled"})
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)
