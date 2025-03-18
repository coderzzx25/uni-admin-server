pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'umi-admin-server-image'
        DOCKER_CONTAINER = 'umi-admin-server-container'
        APP_PORT = '3000'
        REPO_URL = 'https://github.com/coderzzx25/uni-admin-server.git'
        BRANCH = 'main'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: env.BRANCH, url: env.REPO_URL
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE}:latest ."
                }
            }
        }

        stage('Stop and Remove Existing Container') {
            steps {
                script {
                    sh "docker stop ${DOCKER_CONTAINER} || true"
                    sh "docker rm ${DOCKER_CONTAINER} || true"
                }
            }
        }

        stage('Deploy with Docker') {
            steps {
                script {
                    sh "docker run -d --name ${DOCKER_CONTAINER} -p ${APP_PORT}:3000 ${DOCKER_IMAGE}:latest"
                }
            }
        }
    }
}
