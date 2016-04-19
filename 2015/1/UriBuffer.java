import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.List;

public class UriBuffer {

    private static String DEFAULT_PATH = "/home/ils/Projects/sandbox/tuenti-challenge/2015/1/";

    private List<String> readLines(String inputFile) {
        try {
            return Files.readAllLines(Paths.get(inputFile), Charset.forName("UTF-8"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void printSolution(String inputFile) {
        List<String> lines = readLines(inputFile);
        Iterator<String> it = lines.iterator();
        long numberOfCases = Long.parseLong(it.next());
        for (int i = 0; i < numberOfCases; i++) {
            long currentUri = Long.parseLong(it.next());
            System.out.println(Double.valueOf(Math.ceil(currentUri / 2.0)).longValue());
        }
    }

    public static void main(String[] args) {
        UriBuffer buffer = new UriBuffer();
        String inputFile = args.length > 0 ? args[0] : DEFAULT_PATH + "testInput";
        buffer.printSolution(inputFile);
    }
}
