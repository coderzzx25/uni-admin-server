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
                git branch: 'main', url: 'https://github.com/coderzzx25/uni-admin-server.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // 使用 Docker Pipeline 插件构建镜像
                    docker.build("$IMAGE_NAME")
                }
            }
        }

        stage('Stop Old Container') {
            steps {
                script {
                    // 停止并删除旧容器
                    try {
                        docker.stop("$CONTAINER_NAME")
                        docker.remove("$CONTAINER_NAME")
                    } catch (Exception e) {
                        echo "旧容器不存在或删除失败: ${e}"
                    }
                }
            }
        }

        stage('Run New Container') {
            steps {
                script {
                    // 使用 Docker Pipeline 插件运行新容器
                    docker.run(
                        "$IMAGE_NAME",
                        "--name $CONTAINER_NAME -d -p 3000:3000 --restart=always"
                    )
                }
            }
        }
    }
}
