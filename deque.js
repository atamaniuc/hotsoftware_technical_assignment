export class Deque {
    constructor() {
        this.items = {};
        this.front = 0;
        this.back = 0;
    }

    isEmpty() {
        return this.back === this.front;
    }

    addFront(element) {
        if (this.isEmpty()) {
            this.back++;
        }
        this.items[--this.front] = element;
    }

    addBack(element) {
        this.items[this.back++] = element;
    }

    removeFront() {
        if (this.isEmpty()) return undefined;
        let result = this.items[this.front];
        delete this.items[this.front++];
        return result;
    }

    removeBack() {
        if (this.isEmpty()) return undefined;
        let result = this.items[--this.back];
        delete this.items[this.back];
        return result;
    }

    front() {
        if (this.isEmpty()) return undefined;
        return this.items[this.front];
    }

    back() {
        if (this.isEmpty()) return undefined;
        return this.items[this.back - 1];
    }

    size() {
        return this.back - this.front;
    }

    clear() {
        this.items = {};
        this.front = 0;
        this.back = 0;
    }
}
