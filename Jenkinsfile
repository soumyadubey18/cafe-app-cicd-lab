
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        DOCKER_IMAGE = 'soumyadubey18/cafe-app'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
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
                sh 'docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} -t ${DOCKER_IMAGE}:latest .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKERHUB_USER',
                    passwordVariable: 'DOCKERHUB_TOKEN'
                )]) {
                    sh '''
                        set +x
                        echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USER" --password-stdin

                        docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                        docker push ${DOCKER_IMAGE}:latest

                        docker logout
                    '''
                }
            }
        }

        stage('Trigger CD Job') {
            steps {
                build job: 'CD-Job-CafeApp',
                      wait: true,
                      propagate: true
            }
        }
    }

    post {
        success {
            echo 'Cafe App image built, pushed, and deployed successfully.'
        }

        failure {
            echo 'CI/CD pipeline failed. Check Console Output.'
        }
    }
}
