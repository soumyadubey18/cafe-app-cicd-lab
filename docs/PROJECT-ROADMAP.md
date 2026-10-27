# Project roadmap

1. Review the app and open it locally.
2. Push the files to the independent GitHub repository.
3. Learn Dockerfile, image, container, ports, and logs locally.
4. Connect the repository to Jenkins.
5. Add image tagging and Docker Hub push using Jenkins Credentials.
6. Use Ansible to configure/manage a deployment host.
7. Review Kubernetes manifests and set the correct image reference.
8. Deploy to EKS only after checking AWS budget and cleanup steps.
9. Test the app and practise troubleshooting.
10. Delete paid lab resources when finished.

## Cost and security
EC2, EKS, and LoadBalancer resources can incur charges. Check current AWS pricing and existing account resources before starting. Delete the Kubernetes LoadBalancer Service before deleting the cluster, then verify related resources are gone. Prefer IAM roles and least-privilege access. Never commit AWS keys, Docker Hub tokens, Jenkins secrets, or SSH private keys.
