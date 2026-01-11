minikube start --driver=docker
& minikube -p minikube docker-env | Invoke-Expression
docker info | findstr Name
cd C:\Users\mahar\Downloads\cloud-eval\all versions\Kubernetes
cd backend
docker build -t movie-backend:1.0 .
cd ..
cd frontend
docker build -t movie-frontend:1.0 .
cd ..
docker images | findstr movie
kubectl apply -f k8s/
kubectl get pods
minikube service movie-frontend-service
