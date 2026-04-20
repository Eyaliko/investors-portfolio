"""
One-time VPS setup for portfolio.excl-group.com.
Creates /var/www/portfolio/{dist}, installs nginx site, reloads nginx,
and ensures ~/.ssh/deploy_ed25519.pub is in root's authorized_keys.
"""
import paramiko
import pathlib
import sys

HOST = '89.167.34.98'
USER = 'root'
PASSWORD = 'Ariston@VPS2024!'

NGINX_CONF = pathlib.Path('C:/Users/User/vps-hosting/sites/investors-portfolio/nginx.conf').read_text(encoding='utf-8')
DEPLOY_PUBKEY = pathlib.Path.home().joinpath('.ssh/deploy_ed25519.pub').read_text().strip()

def run(client, cmd):
    print(f'$ {cmd}')
    stdin, stdout, stderr = client.exec_command(cmd, get_pty=True)
    code = stdout.channel.recv_exit_status()
    out = stdout.read().decode().strip()
    if out:
        print(out)
    if code != 0:
        print(f'  (exit {code})')
    return code, out

def put_file(client, remote_path, content):
    sftp = client.open_sftp()
    with sftp.file(remote_path, 'w') as f:
        f.write(content)
    sftp.close()
    print(f'wrote {remote_path} ({len(content)} bytes)')

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASSWORD, timeout=20)

print('=== Ensure webroot dirs ===')
run(client, 'mkdir -p /var/www/portfolio/dist')
run(client, 'chown -R www-data:www-data /var/www/portfolio')

print('\n=== Install nginx site ===')
put_file(client, '/etc/nginx/sites-available/portfolio', NGINX_CONF)
run(client, 'ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio')
code, _ = run(client, 'nginx -t')
if code == 0:
    run(client, 'systemctl reload nginx')
    print('nginx reloaded ✓')
else:
    print('!! nginx -t failed; not reloading')
    sys.exit(1)

print('\n=== Ensure deploy SSH key in authorized_keys ===')
run(client, 'mkdir -p /root/.ssh && chmod 700 /root/.ssh')
# Check if key already present
code, out = run(client, f"grep -Fxq '{DEPLOY_PUBKEY}' /root/.ssh/authorized_keys && echo PRESENT || echo MISSING")
if 'PRESENT' in out:
    print('deploy key already authorized ✓')
else:
    run(client, f"echo '{DEPLOY_PUBKEY}' >> /root/.ssh/authorized_keys && chmod 600 /root/.ssh/authorized_keys")
    print('deploy key installed ✓')

print('\n=== Sanity check ===')
run(client, 'ls -la /var/www/portfolio/')
run(client, 'curl -s -o /dev/null -w "http://127.0.0.1 H%{http_code}\\n" -H "Host: portfolio.excl-group.com" http://127.0.0.1/')

client.close()
print('\n✓ VPS ready for portfolio.excl-group.com')
