import { Loader } from '@pixi/loaders';

export class SpineLoader {
    private _url: string;
    private _name: string;
    private _loader: Loader;
    private _data: any;

    constructor(name: string, url: string) {
        this._url = url;
        this._name = name;

        this._loader = new Loader();
        this._loader.add(name, url).load(this._loaded);
    }

    private _loaded(loader, res) {
        this._data = res.name.spineData;
    }

    public getData() {
        return this._data;
    }

    get url(): string {
        return this._url;
    }

    get name(): string {
        return this.name;
    }

}
