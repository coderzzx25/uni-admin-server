pipeline {
    agent any

    environment {
        IMAGE_NAME = 'umi-admin-server-image'
        CONTAINER_NAME = 'umi-admin-server-container'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                deleteDir() // 清理 Jenkins 工作空间
            }
        }

        stage('Clone Repository') {
            steps {
                git 'https://github.com/coderzzx25/uni-admin-server.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh 'docker stop $CONTAINER_NAME || true'
                sh 'docker rm $CONTAINER_NAME || true'
            }
        }

        stage('Run New Container') {
            steps {
                sh '''
                docker run -d --name $CONTAINER_NAME -p 3000:3000 \
                  --restart=always \
                  $IMAGE_NAME
                '''
            }
        }
    }
}
