import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import moment from "moment";
import Avatar from "./Avatar";
import { primaryColor } from "../utils/Color";
import { supabase } from "../backend/supabaseClient";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";

interface Comment {
  id: number;
  comment: string;
  created_at: string;
  edited: boolean;
  parent_info?: UserInfo;
  teamID?: number;
  team_info?: UserInfo;
}

interface UserInfo {
  name: string;
}

const ITEMS_PER_PAGE = 5;

const IssueCommentList: React.FC<{ id: number }> = React.memo(({ id }) => {
  const [loading, setLoading] = useState(false);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchIssueComments = useCallback(async (currentPage: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {

      const res = await supabase_api.shared.getIssueComment(commentList?.length, commentList?.length+ITEMS_PER_PAGE, id);
      
      setCommentList(prev => {
        if (currentPage === 1) {
          return res as Comment[];
        }
        return [...prev, ...res] as Comment[];
      });
      console.log(res.length)
      setHasMore(res.length === ITEMS_PER_PAGE);
      setPage(currentPage+1);
    } catch (error) {
      ErrorLogger.shared.ShowError("IssueCommentList: fetchComments", error);
    } finally {
      setLoading(false);
    }
  }, [hasMore,loading]);

  useEffect(() => {
    fetchIssueComments(1);

    const channel = supabase
      .channel("issue-comment-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "issue_comment" },
        (payload) => {
          const { eventType, new: newComment } = payload;
          if (eventType === "INSERT") {
            handleCommentChange(newComment.id, 'insert');
          } else if (eventType === "UPDATE") {
            handleCommentChange(newComment.id, 'update');
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleCommentChange = useCallback(async (commentId: number, type: 'insert' | 'update') => {
    try {
      const result = await supabase_api.shared.getIssueCommentById(commentId);
      
      setCommentList(prev => {
        if (type === 'insert') {
          return [...prev, result as Comment];
        }
        return prev.map(comment => 
          comment.id === commentId ? result as Comment : comment
        );
      });
    } catch (error) {
      ErrorLogger.shared.ShowError(`IssueCommentList: ${type}Comment`, error);
    }
  }, []);

  const renderComment = useCallback(({ item }: { item: Comment }) => {
    const { comment, created_at, parent_info, team_info } = item;

    return (
      <View style={styles.comment}>
        <Avatar width={24} height={24} user={team_info ?? parent_info} />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentAuthor}>
              {team_info?.name ?? parent_info?.name}
            </Text>
            {parent_info && <Text style={styles.commentByParent}>(Parent)</Text>}
          </View>
          <Text style={styles.commentText}>{comment}</Text>
          <Text style={styles.commentDate}>{moment(created_at).fromNow()}</Text>
        </View>
      </View>
    );
  }, []);

  const renderFooter = useCallback(() => {
    if (!hasMore) return null;
    return (
      <TouchableOpacity
        onPress={() => fetchIssueComments(page + 1)}
        style={styles.loadMoreBtn}
        disabled={loading}
      >
        <Text style={styles.loadMoreText}>
          {loading ? "Loading..." : "View More"}
        </Text>
      </TouchableOpacity>
    );
  }, [hasMore, loading, page, fetchIssueComments]);

  const renderEmpty = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No comments added</Text>
      </View>
    );
  }, [loading]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Comments</Text>
      <FlatList
        data={commentList}
        renderItem={renderComment}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    flexShrink: 1 
  },
  header: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    marginBottom: 8,
    paddingHorizontal: 16
  },
  listContainer: {
    paddingHorizontal: 16
  },
  comment: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 16,
    flexShrink: 1,
    marginTop: 4,
  },
  commentContent: {
    flexShrink: 1,
    marginEnd: 8,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentAuthor: {
    fontSize: 16,
    fontFamily: "RHD-Medium",
    marginRight: 8,
  },
  commentByParent: {
    fontFamily: "RHD-Regular",
    fontSize: 14,
  },
  commentText: {
    fontFamily: "RHD-Regular",
    marginTop: 4,
    fontSize: 16,
    flexShrink: 1,
  },
  commentDate: {
    fontSize: 12,
    color: "#6c757d",
    textAlignVertical: "center",
    marginTop: 4,
  },
  loadMoreBtn: {
    padding: 10,
  },
  loadMoreText: {
    color: primaryColor,
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
});

export default IssueCommentList;