<<<<<<< HEAD
# Cafe App CI/CD Lab

A simple static Cafe App for learning GitHub, Jenkins, Docker, Ansible, and Kubernetes on AWS.

## Run locally
Open `index.html` in your browser.

## Run with Docker
```bash
docker build -t cafe-app:local .
docker run --name cafe-app -d -p 8080:80 cafe-app:local
```
Open http://localhost:8080. Stop/remove with `docker rm -f cafe-app`.

## Structure
- `index.html`, `style.css`, `script.js`: simple cafe website
- `Dockerfile`: serves the site using Nginx
- `Jenkinsfile`: starter CI pipeline that validates files and builds a Docker image
- `ansible/`: reserved for Ansible playbooks
- `kubernetes/`: starter Deployment and LoadBalancer Service manifests
- `docs/PROJECT-ROADMAP.md`: learning sequence and safety notes

The pipeline is a learning starter, not production-ready. Never commit passwords, tokens, AWS keys, or SSH private keys. AWS EC2, EKS, and LoadBalancer resources can incur charges; check current pricing and clean up lab resources.
=======
# cafe-app-cicd-lab
Hands-on DevOps project using Jenkins, Ansible, Docker, AWS EC2, and Amazon EKS.
>>>>>>> c73a29b2c0ebface081e7a294ba6ba4f23107cc1
