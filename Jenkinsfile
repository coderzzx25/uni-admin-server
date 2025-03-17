pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'umi-admin-server-image'
        DOCKER_CONTAINER = 'umi-admin-server-container'
        APP_PORT = '3000'
        GIT_CREDENTIALS_ID = 'AAAAB3NzaC1yc2EAAAADAQABAAACAQCuYJKBtXxt6QWpaqwJSC/ecDhtDEI8WsdkXasRN3wSsW+lP0Ikp3Em0yrBAtGVdza5eEJ2hU2xHbnysi0Ftgg5jEEUk4fCShxWu7aFEqslmE1fzCx8ALb2PjpzX/AIhbqXY1yLJ9KqsD5N0tDT8/KgiDOEyvisnJ8CBA8V6bMvoMyafA+usxIZuhQniAqCuzCE704UlVKYpEm4xgvDy+H/ICEUJvifVpgwR2/PvCSQtoWsD8ej44r4rMEbutatLWjDvYD7PhJ3TgGM7mecjVo9hMgtejDAUFIfapZMUz+nS+6RCOazpLSTByekh7/YQ2G3XvG7oYxYBUsehZUdyWr433XZMxadCj4eTJVDCYrRZjMRPSaaPixJlFby94BLl+YougYUSoXgY6NMd8bt2ONXPw8T35a8UG8DPlURy9xg/KDUgwJfAtVLK+O6NbssW8eNljav4jB88ex6fGU8wk/kBlsJrGnN/BIOwQGp07fc6E3e+XKxVxGsunKB7A3g0HGbY0IzW15LaplCY6LIW/U82WAyNWt7qqaUX/aVxgHkLnCU3MANKlcSwn6nIFGY6AL19r77ZEJCYK4EPX3LdwKKb5C7XGzQBKQ6Ff03S4EXHcRieARvputcT6fPVe3XzvjF59aSpXaIh6IPbVyf1rz6nDbA3hXE5VGevGWFC0ksrw=='
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout scm: [
                        $class: 'GitSCM',
                        branches: [[name: 'main']],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [],
                        userRemoteConfigs: [[
                            credentialsId: GIT_CREDENTIALS_ID,
                            url: 'git@github.com:coderzzx25/uni-admin-server.git'
                        ]]
                    ]
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                        docker build -t $DOCKER_IMAGE .
                    """
                }
            }
        }

        stage('Deploy with Docker') {
            steps {
                script {
                    sh """
                        docker stop $DOCKER_CONTAINER || true
                        docker rm $DOCKER_CONTAINER || true
                        docker run -d --restart=always --name $DOCKER_CONTAINER -p $APP_PORT:$APP_PORT $DOCKER_IMAGE
                    """
                }
            }
        }
    }
}
