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

const baseUrl = 'https://localhost:7184/';
//const baseUrl = 'http://localhost:5044/';

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
                target: baseUrl,
                secure: false
            },
            '^/auth/authorize-user': {
                target: baseUrl,
                secure: false
            },
            '^/auth/create-patient': {
                target: baseUrl,
                secure: false
            },
            '^/auth/get-verification-mail': {
                target: baseUrl,
                secure: false
            },
            '^/api/admin/*': {
                target: baseUrl,
                secure: false
            },
            '^/api/doctor/*': {
                target: baseUrl,
                secure: false
            },
            '^/api/service/*': {
                target: baseUrl,
                secure: false
            },
            '^/api/appointment/*': {
                target: baseUrl,
                secure: false
            },
            '^/api/patient/*': {
                target: baseUrl,
                secure: false
            },
            '^/api/consultation/*': {
                target: baseUrl,
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
