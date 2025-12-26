import { useState } from "react";
import { useI18n } from "@/hooks/use-i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Users,
  Clock,
  Settings as SettingsIcon,
  Search,
  Hash
} from "lucide-react";
import { useChatContext } from "@/context/ChatContext";
import { ChatHistory } from "./ChatHistory"; // Keep ChatHistory import as it's used in the new structure

const VirtualChat = () => {
  const t = useI18n();
  const tr = t("chat_stats") as any;
  const {
    activeConversations,
    waitingChats,
    isConnected,
  } = useChatContext();

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-purple-100">{t("chat_title")}</h1>
          <p className="text-purple-400">{t("chat_subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`${isConnected ? 'border-green-600 text-green-400' : 'border-red-600 text-red-400'} bg-gray-800`}
          >
            <span className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            {isConnected ? t("chat_connected") : t("chat_disconnected")}
          </Badge>
          <Button variant="outline" size="icon" className="bg-gray-800 border-purple-700 text-purple-400 hover:text-purple-300">
            <SettingsIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-700 border-purple-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">{tr.active_chats}</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-100">{activeConversations.length}</div>
            <p className="text-xs text-purple-400">{tr.conversations}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-700 border-purple-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">{tr.waiting_chats}</CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-100">{waitingChats.length}</div>
            <p className="text-xs text-purple-400">{tr.waiting_attention}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-700 border-purple-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">{tr.status}</CardTitle>
            <Hash className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-lg font-bold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? t("chat_connected") : t("chat_disconnected")}
            </div>
            <p className="text-xs text-purple-400">{tr.websocket_server}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="live" className="space-y-4">
        <TabsList className="bg-gray-800 border-purple-700">
          <TabsTrigger value="live" className="data-[state=active]:bg-purple-700">{t("chat_live_tab")}</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-purple-700">{t("chat_history_tab")}</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Lista de chats */}
            <Card className="bg-gray-700 border-purple-700 lg:col-span-1 flex flex-col">
              <div className="p-4 border-b border-purple-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder={t("search")}
                    className="w-full pl-10 bg-gray-800 border-purple-700 text-purple-100 rounded-md focus:ring-2 focus:ring-purple-700 p-2"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 text-center text-purple-400">
                  {t("chat_empty")?.select_chat || "Select a chat"}
                </div>
              </div>
            </Card>

            {/* Ventana de chat */}
            <Card className="bg-gray-700 border-purple-700 lg:col-span-2 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="h-16 w-16 bg-purple-900/30 rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-100">{t("chat_empty").no_active_chat}</h3>
                <p className="text-purple-400 max-w-sm mx-auto mt-2">
                  {t("chat_empty").description}
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <ChatHistory embedded={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VirtualChat;
