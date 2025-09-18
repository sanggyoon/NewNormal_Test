<?php
/**
 * PHP 프록시 테스트 파일
 * 브라우저에서 직접 접속하여 프록시가 정상 동작하는지 확인
 */

header('Content-Type: text/html; charset=utf-8');

echo "<h2>API 프록시 테스트</h2>";
echo "<p>현재 시간: " . date('Y-m-d H:i:s') . "</p>";

// 프록시 파일이 존재하는지 확인
$proxy_file = __DIR__ . '/api_proxy.php';
if (file_exists($proxy_file)) {
    echo "<p style='color: green;'>✅ api_proxy.php 파일이 존재합니다.</p>";
} else {
    echo "<p style='color: red;'>❌ api_proxy.php 파일을 찾을 수 없습니다.</p>";
}

// PHP cURL 확장이 설치되어 있는지 확인
if (extension_loaded('curl')) {
    echo "<p style='color: green;'>✅ PHP cURL 확장이 설치되어 있습니다.</p>";
} else {
    echo "<p style='color: red;'>❌ PHP cURL 확장이 설치되어 있지 않습니다.</p>";
}

echo "<hr>";
echo "<h3>프록시 직접 테스트</h3>";
echo "<p>아래 버튼을 클릭하여 API 프록시를 직접 테스트할 수 있습니다:</p>";

?>
<form method="post" action="api_proxy.php" target="_blank">
    <input type="hidden" name="user_id" value="demo">
    <input type="hidden" name="cluster_code" value="040403">
    <input type="hidden" name="date_type" value="today">
    <button type="submit" style="padding: 10px 20px; background: #007cba; color: white; border: none; cursor: pointer;">
        API 프록시 테스트 실행
    </button>
</form>

<hr>
<h3>JavaScript 테스트</h3>
<button onclick="testProxy()" style="padding: 10px 20px; background: #28a745; color: white; border: none; cursor: pointer;">
    JavaScript로 프록시 테스트
</button>
<div id="result" style="margin-top: 20px; padding: 10px; background: #f8f9fa; border: 1px solid #ddd;"></div>

<script>
async function testProxy() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<p>테스트 중...</p>';
    
    try {
        const formData = new URLSearchParams();
        formData.append('user_id', 'demo');
        formData.append('cluster_code', '040403');
        formData.append('date_type', 'today');
        
        const response = await fetch('./api_proxy.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });
        
        const text = await response.text();
        
        resultDiv.innerHTML = `
            <h4>응답 결과:</h4>
            <p><strong>HTTP Status:</strong> ${response.status}</p>
            <p><strong>Response:</strong></p>
            <pre style="background: #f1f1f1; padding: 10px; overflow: auto;">${text}</pre>
        `;
        
        // JSON 파싱 시도
        try {
            const json = JSON.parse(text);
            if (json.success) {
                resultDiv.innerHTML += '<p style="color: green;"><strong>✅ 프록시 연결 성공!</strong></p>';
            } else {
                resultDiv.innerHTML += '<p style="color: orange;"><strong>⚠️ 프록시는 동작하지만 API에서 오류 응답</strong></p>';
            }
        } catch (e) {
            resultDiv.innerHTML += '<p style="color: red;"><strong>❌ JSON 파싱 실패 (PHP 오류 가능성)</strong></p>';
        }
        
    } catch (error) {
        resultDiv.innerHTML = `
            <h4>오류 발생:</h4>
            <p style="color: red;">${error.message}</p>
        `;
    }
}
</script>
