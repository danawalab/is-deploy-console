export function agentLog(ip, apiEndPoint, method) {
    const koreaTime = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date())
    const date = new Date(koreaTime).toISOString().split('T')[0];
    const time = new Date(koreaTime).toTimeString().split(' ')[0];

    console.log(`${date}-${time} : ${ip} 에서 ${apiEndPoint} 를 ${method} 메소드로 호출 하였습니다.`);
}