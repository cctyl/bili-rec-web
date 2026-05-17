@echo off
title Vue Dist Runner
echo 正在启动本地服务器...
:: 删掉 npx，直接调用全局的 http-server
http-server ./local -o -p 8080
pause