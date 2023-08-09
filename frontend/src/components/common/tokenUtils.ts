function getTokenInfo() {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(atob(token.split('.')[1])) : null;
}

function getUserId() {
    const tokenInfo = getTokenInfo();
    return tokenInfo ? tokenInfo.user_id : null;
}

function getName() {
    const tokenInfo = getTokenInfo();
    return tokenInfo ? tokenInfo.name : null;
}

export {getUserId, getName};