import Root from './file-upload.svelte';
import Dropzone from './file-upload-dropzone.svelte';
import List from './file-upload-list.svelte';
import Item from './file-upload-item.svelte';

export type { FileUploadProps, FileUploadFile } from './file-upload.svelte';
export type { FileUploadDropzoneProps } from './file-upload-dropzone.svelte';
export type { FileUploadListProps } from './file-upload-list.svelte';
export type { FileUploadItemProps } from './file-upload-item.svelte';

export {
	Root,
	Dropzone,
	List,
	Item,
	//
	Root as FileUpload,
	Dropzone as FileUploadDropzone,
	List as FileUploadList,
	Item as FileUploadItem
};
