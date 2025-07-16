pipeline {
  agent any

  parameters {
    string(name: 'ENV', defaultValue: 'dev', description: 'Target environment (dev/staging/prod)')
    string(name: 'IMAGE_TAG', defaultValue: 'latest', description: 'Docker image tag')
    string(name: 'DB_HOST', defaultValue: 'postgres', description: 'Database host')
    string(name: 'DB_NAME', defaultValue: 'bluebricks', description: 'Database name')
  }

  environment {
    NODE_ENV = "${params.ENV}"
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Build') {
      steps {
        sh """
        cp .env.template .env
        sed -i 's|{{DB_HOST}}|${DB_HOST}|' .env
        sed -i 's|{{DB_NAME}}|${DB_NAME}|' .env
        sed -i 's|{{ENV}}|${NODE_ENV}|' .env
        """
        sh 'npm run build'
      }
    }

    stage('Docker') {
      steps {
        sh "docker build -t bluebricks/blueprints-service:${IMAGE_TAG} ."
      }
    }

    stage('Deploy') {
      steps {
        sh "helm upgrade --install blueprints-service ./helm -f helm/values-${ENV}.yaml --set image.tag=${IMAGE_TAG}"
      }
    }
  }
}
