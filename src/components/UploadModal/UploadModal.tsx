import "./UploadModal.css";

import { Button, Modal } from "antd";
import type { RcFile } from "antd/es/upload/interface";
import { useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

import { postFile } from "../../api/fileApi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearFileState, fetchFileRequest } from "../../redux/slices/fileSlice";
import UploadForm from "./UploadForm";

const UploadModal = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const fileState = useAppSelector((state) => state.file);
  const [searchParams] = useSearchParams();
  const params = useParams<{ id: string }>();
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState("");
  const [file, setFile] = useState<RcFile | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const location = useLocation();

  const showModal = (): void => {
    setOpen(true);
  };

  const handleOk = (): void => {
    if (!file) {
      return;
    }
    dispatch(
      fetchFileRequest({
        userId: params.id,
        fetchFunction: async (token) => {
          await postFile(
            file,
            token,
            name,
            (searchParams.get("path") ?? "") + path,
            note
          );
        },
        callback: () => {
          setOpen(false);
          setFile(null);
          setName("");
          setPath("");
          setNote("");
        },
      })
    );
  };

  const handleCancel = (): void => {
    dispatch(clearFileState());
    setOpen(false);
    setFile(null);
    setName("");
    setPath("");
    setNote("");
  };

  return (
    <>
      <Button
        className="custom-button"
        disabled={
          location.pathname.includes("/admin") ||
          location.pathname.startsWith("/admin/storages/")
        }
        type="primary"
        onClick={showModal}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        style={
          isHovered ? { backgroundColor: "#254e83" } : { backgroundColor: "" }
        }
      >
        Upload File
      </Button>
      <Modal
        title="Upload File"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={fileState.loading}
            onClick={handleOk}
            style={{
              backgroundColor: "#092954",
            }}
          >
            Upload
          </Button>,
        ]}
      >
        <UploadForm
          name={name}
          path={path}
          note={note}
          onNameChange={setName}
          onPathChange={setPath}
          onFileChange={setFile}
          onNoteChange={setNote}
        />
      </Modal>
    </>
  );
};

export default UploadModal;
