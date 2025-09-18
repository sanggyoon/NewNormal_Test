<?php
/**
 * API 프록시 파일 - CORS 우회용
 * 클라이언트 → 이 파일 → 외부 API → 이 파일 → 클라이언트
 */

// CORS 헤더 설정
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// OPTIONS 요청 처리 (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 실제 API 엔드포인트
$API_BASE = 'https://lssatdk2.cafe24.com';
$API_ENDPOINT = '/test/main_api.php';
$target_url = $API_BASE . $API_ENDPOINT;

try {
    // POST 데이터 받기
    $post_data = $_POST;
    
    // 데이터가 없으면 기본값 설정 (테스트용)
    if (empty($post_data)) {
        $post_data = [
            'user_id' => 'demo',
            'cluster_code' => '040403',
            'date_type' => 'today'
        ];
    }
    
    // cURL로 외부 API 호출
    $ch = curl_init();
    
    curl_setopt_array($ch, [
        CURLOPT_URL => $target_url,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($post_data),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTPHEADER => [
            'Accept: application/json, text/plain, */*',
            'Content-Type: application/x-www-form-urlencoded;charset=UTF-8',
            'User-Agent: Mozilla/5.0 (compatible; API-Proxy/1.0)'
        ],
        CURLOPT_SSL_VERIFYPEER => false, // 개발 환경용
        CURLOPT_SSL_VERIFYHOST => false  // 개발 환경용
    ]);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    
    curl_close($ch);
    
    // cURL 오류 처리
    if ($response === false || !empty($curl_error)) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'cURL 요청 실패: ' . $curl_error,
            'proxy_status' => 'curl_error'
        ]);
        exit();
    }
    
    // HTTP 상태 코드 확인
    if ($http_code !== 200) {
        http_response_code($http_code);
        echo json_encode([
            'success' => false,
            'error' => 'API 서버 응답 오류 (HTTP ' . $http_code . ')',
            'response' => $response,
            'proxy_status' => 'http_error'
        ]);
        exit();
    }
    
    // 응답이 JSON인지 확인
    $decoded = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        // JSON이 아닌 경우 원본 응답을 반환하되 성공 여부를 표시
        echo json_encode([
            'success' => true,
            'message' => 'API 연결 성공 (응답이 JSON 형식이 아님)',
            'raw_response' => $response,
            'proxy_status' => 'success_non_json'
        ]);
        exit();
    }
    
    // JSON 응답인 경우 프록시 상태 정보 추가
    $decoded['proxy_status'] = 'success';
    $decoded['proxy_timestamp'] = date('Y-m-d H:i:s');
    
    echo json_encode($decoded);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => '프록시 서버 오류: ' . $e->getMessage(),
        'proxy_status' => 'exception'
    ]);
}
?>