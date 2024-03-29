import { EditTwoTone, FileOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Flex, Typography } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { deleteFile } from "../../api/fileApi";
import { useAppDispatch } from "../../redux/hooks";
import { fetchFileRequest } from "../../redux/slices/fileSlice";
import type { TFile } from "../../types";
import { sizeConverter } from "../StorageStats/StorageStats";
const { Text } = Typography;

type FileProps = {
  file: TFile;
  onModalOpen: () => void;
  onSetFileClicked: (file: TFile) => void;
};

const File = ({
  file,
  onModalOpen,
  onSetFileClicked,
}: FileProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const params = useParams<{ id: string }>();
  const [lastDownload, setLastDownload] = useState(
    file.last_download
      ? new Date(file.last_download).toLocaleDateString()
      : "Never"
  );
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <p style={{ width: "15em" }}>Note: {file.note}</p>,
    },
    {
      key: "2",
      label: <span>Size: {sizeConverter(file.size)}</span>,
    },
    {
      key: "3",
      label: (
        <span>Created: {new Date(file.created_at).toLocaleDateString()}</span>
      ),
    },
    {
      key: "4",
      label: <span>Last Download: {lastDownload}</span>,
    },
    {
      key: "5",
      label: (
        <>
          <Text>Link: </Text>
          <Text ellipsis copyable>
            {import.meta.env.VITE_SERVER_BASE_URL + file.url_path}
          </Text>
        </>
      ),
    },
    {
      key: "6",
      label: (
        <span>
          Edit <EditTwoTone />
        </span>
      ),
      onClick: () => {
        onModalOpen();
        onSetFileClicked(file);
      },
    },
    {
      key: "7",
      label: (
        <a
          href={`${import.meta.env.VITE_SERVER_BASE_URL}/download${file.url_path}`}
          onClick={() => {
            setLastDownload(new Date().toLocaleDateString());
          }}
          download
        >
          Download File
        </a>
      ),
    },
    {
      key: "8",
      label: <span>Delete</span>,
      danger: true,
      onClick: () =>
        dispatch(
          fetchFileRequest({
            userId: params.id,
            fetchFunction: async (token: string) => {
              await deleteFile(file.pk, token);
            },
            callback: () => {},
          })
        ),
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} placement="bottomLeft" arrow>
        <Flex vertical align="center" style={{ cursor: "pointer" }}>
          <FileOutlined style={{ fontSize: "5em", color: "#092954" }} />
          <Text>{file.name}</Text>
        </Flex>
      </Dropdown>
    </>
  );
};

export default File;
