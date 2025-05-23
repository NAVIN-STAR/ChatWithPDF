export class FileUtils {
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    static getFileTypeIcon(type) {
        const icons = {
            'application/pdf': '📄',
            'text/plain': '📝'
        };
        return icons[type] || '📁';
    }
}