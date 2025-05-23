export class ChatMessage {
    constructor(content, isUser = false, isLoading = false) {
        this.content = content;
        this.isUser = isUser;
        this.isLoading = isLoading;
    }

    render() {
        const messageWrapper = document.createElement('div');
        messageWrapper.className = `flex w-full ${this.isUser ? 'justify-end' : 'justify-start'}`;

        const bubble = document.createElement('div');
bubble.className = `p-3 withespace-pre-wrap rounded-lg break-words max-w-full sm:max-w-md md:max-w-lg lg:max-w-prose ${
    this.isUser
        ? 'max-w-lg bg-blue-500 text-white p-3 rounded-lg shadow-md'
        : 'text-white items-start max-w-lg bg-gray-800 p-3 min-w-[100px]'
}`;


        if (this.isLoading) {
            bubble.innerHTML = `
                <div class="max-w-full sm:max-w-md md:max-w-lg lg:max-w-prose animate-pulse space-y-2">
            <div class="h-4 bg-gray-600 rounded w-48 sm:w-56 md:w-64 lg:w-72"></div>
            <div class="h-4 bg-gray-600 rounded w-32 sm:w-40 md:w-48 lg:w-64"></div>
            <div class="h-4 bg-gray-600 rounded w-32 sm:w-40 md:w-48 lg:w-56"></div>
        </div>`;
        } else {
            bubble.innerHTML = this.content;
        }

        messageWrapper.appendChild(bubble);
        return messageWrapper;
    }
}
