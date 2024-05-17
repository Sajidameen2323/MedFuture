import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

const baseFolder =
    process.env.APPDATA !== undefined && process.env.APPDATA !== ''
        ? `${process.env.APPDATA}/ASP.NET/https`
        : `${process.env.HOME}/.aspnet/https`;

const certificateArg = process.argv.map(arg => arg.match(/--name=(?<value>.+)/i)).filter(Boolean)[0];
const certificateName = certificateArg ? certificateArg.groups.value : "medfuture.client";

if (!certificateName) {
    console.error('Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.')
    process.exit(-1);
}

const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            "components": path.resolve(__dirname, 'src/components'),
            "utils": path.resolve(__dirname, 'src/utils'),
            "assets": path.resolve(__dirname, 'src/assets'),
            "config": path.resolve(__dirname, 'src/config'),
            "store": path.resolve(__dirname, 'src/store'),
            "themes": path.resolve(__dirname, 'src/styles/themes'),
            "context": path.resolve(__dirname, 'src/context'),
            "menu-items": path.resolve(__dirname, 'src/menu-items'),
            "pages": path.resolve(__dirname, 'src/pages'),
            "hooks": path.resolve(__dirname, 'src/hooks'),
            "lotties": path.resolve(__dirname, 'src/lotties'),
        }
    },
    server: {
        proxy: {
            '^/weatherforecast': {
                target: 'https://localhost:7184/',
                secure: false
            },
            '^/auth/authorize-user': {
                target: 'https://localhost:7184/',
                secure: false
            },
            '^/auth/create-patient': {
                target: 'https://localhost:7184/',
                secure: false
            },
            '^/auth/get-verification-mail': {
                target: 'https://localhost:7184/',
                secure: false
            },
            '^/api/admin/*': {
                target: 'https://localhost:7184/',
                secure: false
            },
            '^/api/doctor/*': {
                target: 'https://localhost:7184/',
                secure: false
            },
            '^/api/service/*': {
                target: 'https://localhost:7184/',
                secure: false
            },
            '^/api/appointment/*': {
                target: 'https://localhost:7184/',
                secure: false
            },
            '^/api/patient/*': {
                target: 'https://localhost:7184/',
                secure: false
            },
            '^/api/consultation/*': {
                target: 'https://localhost:7184/',
                secure: false
            }
 
        },
        port: 5173,
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
