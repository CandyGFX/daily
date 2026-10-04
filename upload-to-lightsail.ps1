param (
    [Parameter(Mandatory=$false)]
    [string]$IP = "",

    [Parameter(Mandatory=$false)]
    [string]$KeyPath = "$HOME\.ssh\candy.pem",

    [Parameter(Mandatory=$false)]
    [string]$User = "ubuntu"
)

if (-not $IP) {
    Write-Host "Please provide your Lightsail Public IP." -ForegroundColor Yellow
    Write-Host "Example: .\upload-to-lightsail.ps1 -IP 1.2.3.4 -User ubuntu" -ForegroundColor Cyan
    exit
}

Write-Host "🚀 Uploading daily-app.zip & deploy-lightsail.sh to Lightsail ($IP)..." -ForegroundColor Green

scp -i $KeyPath -o StrictHostKeyChecking=no daily-app.zip deploy-lightsail.sh ${User}@${IP}:~/

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Files uploaded! Now executing deployment script on Lightsail..." -ForegroundColor Green
    ssh -i $KeyPath -o StrictHostKeyChecking=no ${User}@${IP} "chmod +x deploy-lightsail.sh && ./deploy-lightsail.sh"
    Write-Host "🎉 Your app is now running 24/7 on: http://$IP" -ForegroundColor Magenta
} else {
    Write-Host "❌ SCP upload failed. Please check the IP, SSH Key, and Username (ubuntu or bitnami or ec2-user)." -ForegroundColor Red
}
