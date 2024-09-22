var affiliateBalanceSpan =  document.getElementsByClassName('totalAffiliateBalance');
var nonAffiliateBalanceSpan =  document.getElementsByClassName('totalNonAffiliateBalance');
var gameBalanceSpan =  document.getElementsByClassName('gameBalance');
var directReferralBalance =  document.getElementById('directReferralBalance');
var indirectReferralBalance =  document.getElementById('indirectReferralBalance');

document.addEventListener('DOMContentLoaded', async ()=>{
    // Load all user's balances
    try {
       const response = await fetch('/loadBalances');

       if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);    
       }
       const data = await response.json();

       console.log(data);

       affiliateBalanceSpan[0].innerHTML = `$${data.getTotalAffiliateBalanceView[0].affiliateBalance / 1000}`;

       affiliateBalanceSpan[0].classList.remove('spinner-border');

       nonAffiliateBalanceSpan[0].innerHTML = `${data.getTotalNonAffiliateBalanceView[0].nonAffiliateBalance}PP`;

       nonAffiliateBalanceSpan[0].classList.remove('spinner-border');

       gameBalanceSpan[0].innerHTML = `$${data.getTotalGameBalanceView[0].gameBalance}GP`;
       gameBalanceSpan[0].classList.remove('spinner-border');

       directReferralBalance.innerHTML = `$${data.getTotalDirectReferralBalance[0].balance / 1000}`;

       directReferralBalance.classList.remove('spinner-border');

       indirectReferralBalance.innerHTML = `$${data.getTotalIndirectReferralBalance[0].balance / 1000}`;

       indirectReferralBalance.classList.remove('spinner-border');

       gameBalance.innerHTML = `${data.getTotalGameBalanceView[0].gameBalance}gp`;

       gameBalance.classList.remove('spinner-border');
    } catch (error) {
        console.log('Error while loading balances: ', error);
    }
})