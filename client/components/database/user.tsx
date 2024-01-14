"use client"
import { ChimeSDKMediaPipelines } from "aws-sdk";
import axios from "axios";
import { AnyARecord } from "dns";
import React, { use, useEffect, useState } from "react";
import endpoint from "../../variables";
import { useRouter } from "next/navigation";
import { Spinner, Toast, useDisclosure } from "@chakra-ui/react";
import { useCookies } from "react-cookie";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const User = ({ refresh }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    onOpen();
  }, [onOpen]);
  const [loading, setloading] = useState<any>(false);
  const [isdone, setisdone] = useState<any>(false);
  const handleclick = async () => {
    setloading(true);
    try {
      await axios
        .post(
          `${endpoint}/user_database/createuser`,
          {
            projectId: localStorage.getItem("projectId"),
          },
          {
            headers: { Authorization: `Bearer ${cookies["token"]}` },
          }
        )
        .then((response: any) => {
          Toast(response.data.message);
          setisdone(true);
          setloading(false);
        })
        .catch((err: any) => {
          console.log(err);
          setloading(false);
        });
    } catch (err: any) {
      console.log(err);
      setloading(false);
    }
    // refresh();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-center">
            Authentication System
          </ModalHeader>
          {isdone && <ModalCloseButton onClick={() => refresh()} />}
          <ModalBody className="mt-4">
            <div
              className="bg-blue-500 text-white p-2 rounded mb-5 text-center cursor-pointer"
              onClick={() => {
                if (!isdone) handleclick();
              }}
            >
              {loading ? (
                <Spinner />
              ) : isdone ? (
                "Successfully Created"
              ) : (
                "Let Get Started"
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default User;
