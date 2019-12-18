import { Folder } from "../../models";

export abstract class LsStrategy {

  protected output: Folder;

  init(folderPath: string) {
    this.output = new Folder(folderPath);
  }

  getResult() {
    return this.output;
  }

  abstract async continue(fileList: Folder, depth: number): Promise<boolean>;

}
