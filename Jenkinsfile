pipeline {
    agent any
    options {
        timestamps()
        disableConcurrentBuilds()
    }
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Validate files') {
            steps {
                sh '''
                    test -f index.html
                    test -f style.css
                    test -f script.js
                    test -f Dockerfile
                    echo "Cafe App files are present."
                '''
            }
        }
        stage('Build Docker image') {
            steps {
                sh 'docker build -t cafe-app:${BUILD_NUMBER} .'
            }
        }
    }
    post {
        success { echo 'CI completed: source checked and Docker image built.' }
        failure { echo 'Pipeline failed. Review the console output for the failing stage.' }
    }
}

/*
Starter CI only: Jenkins needs Docker installed and permission to use it.
This does not push to Docker Hub or deploy to EKS yet.
Use Jenkins Credentials for secrets; never hard-code tokens or keys.
*/
