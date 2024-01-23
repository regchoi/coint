# 프로젝트 관리 프로그램

## 프로젝트 개요
문서와 프로젝트를 효율적으로 관리할 수 있도록 도와드립니다.</br>

## 실행 방법
React와 Spring, Redis를 모두 실행시켜야 정상 작동합니다.
1. localhost:3000/login에 접속하여 로그인합니다. </br>
   admin 계정 - ID: admin, PW: admin </br>
   user 계정 - ID: user, PW:0000
2. 초기 생성된 유저의 PW는 0000으로 세팅되어 있습니다.

### ELK 실행 방법
1. docker-compose up
2. localhost:5601로 접속
  ID: elastic 
  PW: changeme
3. HOME - Kibana - Discover에서 로그 확인
