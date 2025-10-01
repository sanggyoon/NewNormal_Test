# API 프록시 설정 완료

CORS 문제를 해결하기 위해 PHP 프록시를 설정했습니다.

## 📁 생성된 파일들

1. **`api_proxy.php`** - 메인 프록시 파일 (CORS 우회용)
2. **`test_proxy.php`** - 프록시 테스트 페이지 
3. **`JS/rawDataBox.js`** - 수정된 JavaScript (프록시 사용하도록 변경)

## 🚀 사용 방법

### 1단계: PHP 서버 실행
로컬에서 PHP 서버를 실행해야 합니다:

```bash
# 프로젝트 폴더에서 실행
cd /Users/sangreal/Documents/Project/NewNormal/Test_code/Frontend
php -S localhost:8000
```

### 2단계: 테스트 실행
브라우저에서 다음 URL로 접속:

- **프록시 테스트**: http://localhost:8000/test_proxy.php
- **메인 페이지**: http://localhost:8000/rawDataIndex.html

## 🔧 동작 방식

```
클라이언트 → api_proxy.php → https://lssatdk2.cafe24.com/test/main_api.php
```

1. JavaScript에서 `./api_proxy.php`로 요청
2. PHP 프록시가 실제 API에 cURL로 요청
3. 응답을 CORS 헤더와 함께 클라이언트에 반환

## 📊 응답 형태

프록시는 다음과 같은 추가 정보를 포함합니다:

```json
{
  "success": true,
  "message": "원본 API 메시지",
  "items": [...],
  "proxy_status": "success",
  "proxy_timestamp": "2025-09-18 10:30:00"
}
```

### 상태 코드들
- `success`: 정상 연결
- `success_non_json`: 연결 성공하지만 JSON이 아닌 응답
- `curl_error`: cURL 요청 실패
- `http_error`: HTTP 오류 응답
- `exception`: 프록시 서버 내부 오류

## 🔍 문제 해결

### PHP 서버가 실행되지 않는 경우
```bash
# PHP 설치 확인
php --version

# 다른 포트로 실행
php -S localhost:8080
```

### CORS 여전히 발생하는 경우
- `file://` 프로토콜 대신 `http://localhost:8000` 사용
- 브라우저 개발자 도구에서 네트워크 탭 확인

### API 연결이 안 되는 경우
1. `test_proxy.php` 페이지에서 직접 테스트
2. `api_proxy.php` 파일의 SSL 설정 확인
3. 방화벽/보안 프로그램 확인

## 🛠 커스터마이징

API 엔드포인트나 파라미터를 변경하려면:

1. **`api_proxy.php`** - 기본 파라미터 수정
2. **`JS/rawDataBox.js`** - RAW_PARAMS 객체 수정

## 💡 추가 참고사항

- 로컬 개발용이므로 SSL 검증 비활성화됨
- 프로덕션 환경에서는 보안 설정 강화 필요
- API 응답이 JSON이 아닌 경우도 처리됨
