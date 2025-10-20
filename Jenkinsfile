pipeline {
    agent any
    tools { nodejs "my-nodejs" }

    stages {
        stage('Install & Lint') {
            steps {
                nodejs('my-nodejs') {
                    // install dependencies reproducibly in CI
                    sh 'npm ci'
                    // fail the build on any lint warnings or errors
                    sh 'npm run lint -- --max-warnings=0'
                }
            }
        }

        stage('Build') {
            steps {
                nodejs('my-nodejs') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        stage('Start (smoke test)') {
            steps {
                nodejs('my-nodejs') {
                    // start production server in background and capture logs
                    sh 'nohup npm run start > jenkins_prod.log 2>&1 &'
                    // give server a moment to start
                    sh 'sleep 3'
                    // smoke-test common ports (3000, 3001)
                    sh 'curl -f http://127.0.0.1:3000 || curl -f http://127.0.0.1:3001'
                }
                echo 'App started successfully (smoke test passed)'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'jenkins_prod.log', allowEmptyArchive: true
        }
    }
}