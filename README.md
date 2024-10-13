## Running Services in the Development Environment

Follow these steps to set up and run the services in your development environment.

1. **Start Colima with Kubernetes and Network Address Support (for people, who can't use docker)**

   This command starts Colima with Kubernetes enabled and ensures that services are accessible via external IPs:

   ```bash
   colima start --kubernetes --network-address
   ```

2. **Set Up Ingress-NGINX**

   Install the Ingress-NGINX controller to handle external access to your Kubernetes services:

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.2/deploy/static/provider/cloud/deploy.yaml
   ```

3. **Create a Secret for JWT Key**

   Create a Kubernetes secret to store your JWT (JSON Web Token) key, replacing `asdf` with your actual JWT key:

   ```bash
   kubectl create secret generic jwt-secret --from-literal JWT_KEY=asdf
   ```

4. **Run Services with Skaffold**

   This command builds, pushes (if necessary), and deploys your services to the Kubernetes cluster:

   ```bash
   skaffold dev
   ```

Now you are ready to develop and run your services in the local Kubernetes environment!
