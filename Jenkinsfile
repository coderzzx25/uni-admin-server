pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'umi-admin-server-image'
        DOCKER_CONTAINER = 'umi-admin-server-container'
        APP_PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/coderzzx25/uni-admin-server.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // 使用 Docker Pipeline 插件构建镜像
                    docker.build("$DOCKER_IMAGE")
                }
            }
        }

        stage('Deploy with Docker') {
            steps {
                script {
                    // 停止并删除现有容器（如果存在）
                    sh """
                        docker stop $DOCKER_CONTAINER || true
                        docker rm $DOCKER_CONTAINER || true
                    """
                    // 使用 Docker Pipeline 插件运行容器
                    docker.image("$DOCKER_IMAGE").run(
                        "--name $DOCKER_CONTAINER -d --restart=always -p $APP_PORT:$APP_PORT"
                    )
                }
            }
        }
    }
}
