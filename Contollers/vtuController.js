fetch('https://passport.k8.isw.la/passport/oauth/token?grant_type=client_credentials', {
    method: 'POST',
    headers: {
        'Authorization': 'KElLSUE3MkM2NUQwMDVGOTNGMzBFNTczRUZFQUMwNEZBNkREOUU0RDM0NEIxOllaTXFaZXpzbHRwU1BOYjQrNDlQR2VQN2xZa3pLbjFhNVNhVlN5ektPaUk9KQ==',
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json'
    }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
