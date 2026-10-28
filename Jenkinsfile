
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
                    set -e

                    test -f index.html
                    test -f style.css
                    test -f script.js
                    test -f Dockerfile

                    echo "Cafe App files are present."

                    echo "Checking website title:"
                    grep -i '<title>' index.html

                    echo "Checking Dockerfile:"
                    cat Dockerfile
                '''
            }
        }

        stage('Build Docker image') {
            steps {
                sh '''
                    docker build --no-cache \
                      -t ${DOCKER_IMAGE}:${BUILD_NUMBER} \
                      -t ${DOCKER_IMAGE}:latest .
                '''
            }
        }

        stage('Verify Docker image') {
            steps {
                sh '''
                    echo "Verifying HTML inside the built image:"
                    docker run --rm \
                      --entrypoint /bin/sh \
                      ${DOCKER_IMAGE}:${BUILD_NUMBER} \
                      -c "grep -i '<title>' /usr/share/nginx/html/index.html"
                '''
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
                        set -e
                        set +x

                        echo "$DOCKERHUB_TOKEN" | docker login \
                          -u "$DOCKERHUB_USER" --password-stdin

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
            echo 'Cafe App image built, verified, pushed, and deployment job completed successfully.'
        }

        failure {
            echo 'CI/CD pipeline failed. Check Console Output for the failed stage.'
        }

        always {
            sh 'docker logout >/dev/null 2>&1 || true'
        }
    }
}
